const MedicalFolder = artifacts.require("MedicalFolder");

module.exports = function (deployer) {
  deployer.deploy(MedicalFolder);
};
