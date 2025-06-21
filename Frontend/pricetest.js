function calculateMonthlyRevenue(productionTonnes, pricePerQuintal) {
    // Convert tonnes to kilograms
    const totalKg = productionTonnes * 1000;

    // Convert ₹/quintal to ₹/kg
    const pricePerKg = pricePerQuintal / 100;

    // Total revenue in a year
    const annualRevenue = totalKg * pricePerKg;

    // Monthly revenue
    const monthlyRevenue = annualRevenue / 12;

    return {
        pricePerKg: pricePerKg.toFixed(2),
        monthlyRevenue: monthlyRevenue.toFixed(2)
    };
}

// Example usage:
const result = calculateMonthlyRevenue(5, 2500); // 5 tonnes, ₹2500 per quintal
console.log("Price per kg: ₹" + result.pricePerKg);
console.log("Monthly revenue: ₹" + result.monthlyRevenue);