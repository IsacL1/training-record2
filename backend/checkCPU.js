const os = require('os');


const checkCPU = () => {
  // Get CPU information
  const cpus = os.cpus();
  console.log('CPU Information:', cpus);
  // Get average CPU usage over all cores
  const avgCPUUsage = os.loadavg();

  console.log('Average CPU Usage (1 min):', avgCPUUsage[0]);

  const cpuUsage = process.cpuUsage();
  console.log('CPU Usage:', cpuUsage);

}


const osu = require('node-os-utils');
async function getCPUUsage() {
  try {
    const info = await osu.cpu.usage();
    console.log('CPU Usage:', info);
  } catch (error) {
    console.error('Error getting CPU usage:', error);
  }
}
// getCPUUsage();
module.exports = {
  getCPUUsage,
  checkCPU
};

