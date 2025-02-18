export const formatNumberWithCommas = (value: string): string => {
    // Remove any existing commas and non-digit characters except decimal point
    const cleanValue = value.replace(/,/g, '').replace(/[^\d.]/g, '');
    
    // Split number into integer and decimal parts
    const [integerPart, decimalPart] = cleanValue.split('.');
    
    // Add commas to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Return formatted number (with decimal part if it exists)
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

export const parseFormattedNumber = (value: string): string => {
    // Remove commas from the formatted number
    return value.replace(/,/g, '');
}; 