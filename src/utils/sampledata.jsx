// GenerateSampleData.jsx

const generateSampleData = () => {
    const sampleData = [];
  
    for (let i = 1; i <= 50; i++) {
      const user = {
        id: i.toString(),
        name: `User ${i} Name`,
        email: `user${i}@mailinator.com`,
        role: i % 2 === 0 ? 'admin' : 'member', // Assigning alternating roles for variety
      };
  
      sampleData.push(user);
    }
  
    return sampleData;
  };
  
export default generateSampleData;
  