// Import the exec function from the child_process module to run shell commands
const { exec } = require('child_process');
// Import the util module to use promisify for converting callback-based functions to promises
const util = require('util');
// Create a promise-based version of exec
const execPromise = util.promisify(exec);

// Constants for preferred device
const PREFERRED_DEVICE = 'iPhone 15 Pro';

/**
 * Script to clear AsyncStorage by erasing simulator data and launching the app
 */
async function clearAsyncStorage() {
  // Log the start of the process
  console.log('🔄 Clearing AsyncStorage by resetting simulator data...');
  
  try {
    // First check if any simulator is running
    let deviceId = null;
    let deviceName = null;
    
    try {
      // Execute a shell command to list booted simulators
      const { stdout: listOutput } = await execPromise('xcrun simctl list devices | grep -v unavailable | grep Booted');
      
      // Get simulator UUID if it's running
      if (listOutput && listOutput.trim() !== '') {
        // Use a regular expression to extract the simulator UUID
        const match = listOutput.match(/\(([A-F0-9-]+)\)/);
        if (match && match[1]) {
          deviceId = match[1].trim(); // Store the device ID
          // Extract the simulator name using another regex
          const nameMatch = listOutput.match(/([^(]+)\s+\(/);
          if (nameMatch && nameMatch[1]) {
            deviceName = nameMatch[1].trim(); // Store the device name
          }
          // Log the found booted simulator
          console.log(`Found booted simulator: ${deviceName} (${deviceId})`);
        }
      }
    } catch (error) {
      // Log if no simulator is currently booted
      console.log('No simulator is currently booted');
    }
    
    // Shutdown any booted simulator
    if (deviceId) {
      try {
        await execPromise('xcrun simctl shutdown booted'); // Shutdown the booted simulator
        console.log('✅ Successfully shut down simulator');
      } catch (error) {
        // Log any error that occurs while shutting down
        console.log('Error shutting down simulator:', error.message);
      }
    }
    
    // Get list of available simulators
    console.log('🔍 Searching for available simulators...');
    const { stdout: allDevicesOutput } = await execPromise('xcrun simctl list devices | grep -v unavailable');
    const allDeviceLines = allDevicesOutput.split('\n').filter(line => line.trim() !== '' && line.includes('('));
    
    // Print all available devices for debugging
    console.log('📱 Available devices:');
    allDeviceLines.forEach(line => {
      const deviceNameMatch = line.match(/([^(]+)\s+\(/);
      if (deviceNameMatch && deviceNameMatch[1]) {
        console.log(`- ${deviceNameMatch[1].trim()}`);
      }
    });
    
    // Find iPhone 15 specifically
    let targetiPhone15Line = null;
    
    // First try exact match for base iPhone 15
    targetiPhone15Line = allDeviceLines.find(line => {
      const namePart = line.match(/([^(]+)\s+\(/);
      return namePart && namePart[1].trim() === PREFERRED_DEVICE;
    });
    
    // If no exact match, try to match any iPhone 15 variant
    if (!targetiPhone15Line) {
      targetiPhone15Line = allDeviceLines.find(line => line.includes('iPhone 15') && !line.includes('Plus') && !line.includes('Pro'));
    }
    
    // Fall back to other iPhone 15 variants
    if (!targetiPhone15Line) {
      targetiPhone15Line = allDeviceLines.find(line => line.includes('iPhone 15 Pro') && !line.includes('Max'));
    }
    
    if (!targetiPhone15Line) {
      targetiPhone15Line = allDeviceLines.find(line => line.includes('iPhone 15 Plus'));
    }
    
    if (!targetiPhone15Line) {
      targetiPhone15Line = allDeviceLines.find(line => line.includes('iPhone 15 Pro Max'));
    }
    
    // Fall back to any iPhone or any device
    if (!targetiPhone15Line) {
      targetiPhone15Line = allDeviceLines.find(line => line.includes('iPhone'));
    }
    
    if (!targetiPhone15Line) {
      targetiPhone15Line = allDeviceLines[0];
    }
    
    // Extract device ID and name
    if (targetiPhone15Line) {
      const deviceMatch = targetiPhone15Line.match(/\(([A-F0-9-]+)\)/);
      const nameMatch = targetiPhone15Line.match(/([^(]+)\s+\(/);
      
      if (deviceMatch && deviceMatch[1] && nameMatch && nameMatch[1]) {
        deviceId = deviceMatch[1].trim();
        deviceName = nameMatch[1].trim();
        console.log(`✅ Selected simulator: ${deviceName} (${deviceId})`);
      }
    }
    
    if (!deviceId) {
      console.error('❌ No iOS simulators found');
      process.exit(1);
    }
    
    // Erase the simulator using its ID
    await execPromise(`xcrun simctl erase ${deviceId}`);
    console.log(`✅ Successfully erased simulator: ${deviceName}`);
    
    // Boot the simulator using its ID
    await execPromise(`xcrun simctl boot ${deviceId}`);
    console.log(`✅ Booted simulator: ${deviceName}`);
    
    // Start the app
    console.log('🚀 Starting the application...');
    exec('expo start --ios', (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error starting app: ${error.message}`);
        return;
      }
      
      // Just pipe the output to console
      process.stdout.write(stdout);
      process.stderr.write(stderr);
    });
    
  } catch (error) {
    // Log any unexpected errors that occur during the process
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Call the function to execute the process
clearAsyncStorage(); 
