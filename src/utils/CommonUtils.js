export function capitalizeWords(string) {
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  export function daysSince(dateString) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
  
    // Calculate the difference in milliseconds
    const differenceInMs = currentDate - givenDate;
  
    // Convert milliseconds to days
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  
    return differenceInDays;
  }
  