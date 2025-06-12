import MedicalFolder from '../models/dossierMedical.js';
import User from '../models/user.js';
import isBlockchainEnabled from '../lib/blockchain.js';

// ─── lazy imports so web3/contract are never touched when blockchain is off ──

async function getBlockchainDeps() {
    const [{ medFolderContract }, { default: web3 }] = await Promise.all([
        import('../contractAbstraction_medFolder.js'),
        import('../web3Setup.js'),
    ]);
    return { medFolderContract, web3 };
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function encodeFolder(folder, web3) {
    const raw = `${folder._id}${folder.medications}${folder.allergies}${folder.testResults}`;
    return web3.utils.keccak256(raw);
}

async function getEthAddress(mongoId) {
    const user = await User.findById(mongoId, 'ethAddress');
    if (!user || !user.ethAddress) throw new Error(`No eth address for user ${mongoId}`);
    return user.ethAddress;
}

// ─── blockchain layer ─────────────────────────────────────────────────────────

async function bcAddMedFolder(hash, senderEth) {
    const { medFolderContract } = await getBlockchainDeps();
    let returnHash = null;
    await medFolderContract.methods.addMedFolder(hash).send({ from: senderEth, gas: 2000000 })
        .then(async () => {
            const events = await medFolderContract.getPastEvents('MedFolderAdded', { fromBlock: 'latest', toBlock: 'latest' });
            if (events[0]) returnHash = events[0].returnValues.medHash;
        })
        .catch(err => console.error("blockchain addMedFolder failed:", err.message));
    return returnHash;
}

async function bcModifyMedFolder(patientEth, newHash, doctorEth) {
    const { medFolderContract } = await getBlockchainDeps();
    let returnHash = null;
    await medFolderContract.methods.modifyMedFolder(patientEth, newHash).send({ from: doctorEth, gas: 2000000 })
        .then(async () => {
            const events = await medFolderContract.getPastEvents('MedFolderAdded', { fromBlock: 'latest', toBlock: 'latest' });
            if (events[0]) returnHash = events[0].returnValues.medHash;
        })
        .catch(err => console.error("blockchain modifyMedFolder failed:", err.message));
    return returnHash;
}

async function bcGetMedFolder(patientEth, senderEth) {
    const { medFolderContract } = await getBlockchainDeps();
    return medFolderContract.methods.getMedFolder(patientEth).call({ from: senderEth });
}

async function bcGiveAccess(doctorEth, patientEth) {
    const { medFolderContract } = await getBlockchainDeps();
    await medFolderContract.methods.giveAccess(doctorEth).send({ from: patientEth, gas: 2000000 });
}

async function bcRemoveAccess(doctorEth, patientEth) {
    const { medFolderContract } = await getBlockchainDeps();
    await medFolderContract.methods.removeAccess(doctorEth).send({ from: patientEth, gas: 2000000 });
}

// ─── exported helper (used by user controller on patient registration) ────────

export async function addMedFolder(hash, senderEth) {
    return bcAddMedFolder(hash, senderEth);
}

// ─── HTTP controllers ─────────────────────────────────────────────────────────

export async function getMedicalFolder(req, res) {
    try {
        const { patientId, requesterId } = req.body;
        if (!patientId || !requesterId) {
            return res.status(400).json({ error: 'patientId and requesterId are required' });
        }

        let medicalFolder;

        if (isBlockchainEnabled()) {
            const [patientEth, senderEth] = await Promise.all([
                getEthAddress(patientId),
                getEthAddress(requesterId),
            ]);
            const onChain = await bcGetMedFolder(patientEth, senderEth);
            if (!onChain) return res.status(404).json({ error: 'Medical folder not found on blockchain' });
            medicalFolder = await MedicalFolder.findOne({ hash: onChain.medHash.toString() });
        } else {
            // requester must be the patient themselves or an allowed doctor
            medicalFolder = await MedicalFolder.findOne({ patient: patientId });
            if (medicalFolder) {
                const isPatient = requesterId.toString() === patientId.toString();
                const isAllowed = medicalFolder.allowedDoctors.some(id => id.toString() === requesterId.toString());
                if (!isPatient && !isAllowed) {
                    return res.status(403).json({ error: 'Access denied' });
                }
            }
        }

        if (!medicalFolder) {
            return res.status(404).json({ error: 'Medical folder not found' });
        }

        return res.status(200).json({ response: medicalFolder });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

export async function createMedicalFolder(req, res) {
    try {
        const { patientId } = req.body;
        if (!patientId) {
            return res.status(400).json({ error: 'patientId is required' });
        }

        const existing = await MedicalFolder.findOne({ patient: patientId });
        if (existing) {
            return res.status(409).json({ error: 'Medical folder already exists for this patient' });
        }

        const medfolder = await MedicalFolder.create({
            patient: patientId,
            medications: '',
            allergies: '',
            testResults: '',
        });

        if (isBlockchainEnabled()) {
            const { default: web3 } = await import('../web3Setup.js');
            const senderEth = await getEthAddress(patientId);
            const encoded = encodeFolder(medfolder, web3);
            const hash = await bcAddMedFolder(encoded, senderEth);
            medfolder.hash = hash ? hash.toString() : null;
            await medfolder.save();
        }

        return res.status(201).json({ response: medfolder });
    } catch (error) {
        console.error('Error creating medical folder:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function modifyMedicalFolder(req, res) {
    try {
        const { patientId, requesterId, medications, allergies, testResults } = req.body;
        if (!patientId || !requesterId) {
            return res.status(400).json({ error: 'patientId and requesterId are required' });
        }

        let medicalFolder;

        if (isBlockchainEnabled()) {
            const [patientEth, doctorEth] = await Promise.all([
                getEthAddress(patientId),
                getEthAddress(requesterId),
            ]);
            const onChain = await bcGetMedFolder(patientEth, doctorEth);
            if (!onChain) return res.status(404).json({ error: 'Medical folder not found on blockchain' });

            medicalFolder = await MedicalFolder.findOne({ hash: onChain.medHash.toString() });
            if (!medicalFolder) return res.status(404).json({ error: 'Medical folder not found in database' });

            medicalFolder.medications = medications ?? medicalFolder.medications;
            medicalFolder.allergies = allergies ?? medicalFolder.allergies;
            medicalFolder.testResults = testResults ?? medicalFolder.testResults;

            const { default: web3 } = await import('../web3Setup.js');
            const newHash = encodeFolder(medicalFolder, web3);
            const txHash = await bcModifyMedFolder(patientEth, newHash, doctorEth);
            medicalFolder.hash = txHash ? txHash.toString() : medicalFolder.hash;
        } else {
            medicalFolder = await MedicalFolder.findOne({ patient: patientId });
            if (!medicalFolder) return res.status(404).json({ error: 'Medical folder not found' });

            const isPatient = requesterId.toString() === patientId.toString();
            const isAllowed = medicalFolder.allowedDoctors.some(id => id.toString() === requesterId.toString());
            if (!isPatient && !isAllowed) {
                return res.status(403).json({ error: 'Access denied' });
            }

            medicalFolder.medications = medications ?? medicalFolder.medications;
            medicalFolder.allergies = allergies ?? medicalFolder.allergies;
            medicalFolder.testResults = testResults ?? medicalFolder.testResults;
        }

        await medicalFolder.save();
        return res.status(200).json({ response: medicalFolder });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

export async function giveMedicalFolderAccess(req, res) {
    try {
        const { patientId, doctorId } = req.body;
        if (!patientId || !doctorId) {
            return res.status(400).json({ error: 'patientId and doctorId are required' });
        }

        if (isBlockchainEnabled()) {
            const [patientEth, doctorEth] = await Promise.all([
                getEthAddress(patientId),
                getEthAddress(doctorId),
            ]);
            await bcGiveAccess(doctorEth, patientEth);
        } else {
            await MedicalFolder.findOneAndUpdate(
                { patient: patientId },
                { $addToSet: { allowedDoctors: doctorId } }
            );
        }

        return res.status(200).json({ message: 'Access granted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

export async function removeMedicalFolderAccess(req, res) {
    try {
        const { patientId, doctorId } = req.body;
        if (!patientId || !doctorId) {
            return res.status(400).json({ error: 'patientId and doctorId are required' });
        }

        if (isBlockchainEnabled()) {
            const [patientEth, doctorEth] = await Promise.all([
                getEthAddress(patientId),
                getEthAddress(doctorId),
            ]);
            await bcRemoveAccess(doctorEth, patientEth);
        } else {
            await MedicalFolder.findOneAndUpdate(
                { patient: patientId },
                { $pull: { allowedDoctors: doctorId } }
            );
        }

        return res.status(200).json({ message: 'Access removed successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
