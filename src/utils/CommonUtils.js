export function capitalizeWords(string) {
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  export function daysSince(dateString) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInMs = currentDate - givenDate;
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    return differenceInDays;
  }


  export function daysLeft(dateString) {
    const currentDate = new Date(dateString);
    const  givenDate= new Date();
    const differenceInMs = currentDate - givenDate;
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    return differenceInDays;
  }

  export const formatTimestampToDate = (timestamp)=> {
    const date = new Date(timestamp);
  
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of year
  
    return `${day}/${month}/${year}`;
  }
  