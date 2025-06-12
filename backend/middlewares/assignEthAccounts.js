import User from '../models/user.js';
import web3 from '../web3Setup.js';

// Assign an eth address to a single newly registered user
export const assignEthAddressToUser = async (user) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const usedAddresses = (await User.find({ ethAddress: { $ne: '' } }, 'ethAddress'))
            .map(u => u.ethAddress.toLowerCase());

        const available = accounts.find(acc => !usedAddresses.includes(acc.toLowerCase()));

        if (available) {
            user.ethAddress = available;
            await user.save({ validateBeforeSave: false });
            console.log(`Assigned eth address ${available} to user ${user._id}`);
        } else {
            console.warn(`No Ganache accounts available for user ${user._id}`);
        }
    } catch (error) {
        console.error('Failed to assign eth address:', error.message);
    }
};

// Batch assign eth addresses to all users that don't have one
export const assignAccountAddresses = async () => {
    try {
        const users = await User.find({ ethAddress: '' });
        const accounts = await web3.eth.getAccounts();
        const usedAddresses = (await User.find({ ethAddress: { $ne: '' } }, 'ethAddress'))
            .map(u => u.ethAddress.toLowerCase());

        let accountIndex = 0;
        for (const user of users) {
            while (accountIndex < accounts.length && usedAddresses.includes(accounts[accountIndex].toLowerCase())) {
                accountIndex++;
            }
            if (accountIndex >= accounts.length) {
                console.warn('Insufficient accounts available for assignment');
                break;
            }
            user.ethAddress = accounts[accountIndex];
            await user.save({ validateBeforeSave: false });
            accountIndex++;
        }

        console.log('Account addresses assigned successfully.');
    } catch (error) {
        console.error('Error assigning account addresses:', error);
    }
};
