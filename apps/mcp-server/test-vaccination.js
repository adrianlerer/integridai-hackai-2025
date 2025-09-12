// Simple test of vaccination workflow logic
const testVaccination = {
  employeeId: "EMP001",
  situation: "Un proveedor me ofrece regalo costoso para acelerar mi decisión",
  riskLevel: "alto",
  department: "compras",
  vaccinationType: "reactiva"
};

console.log("🧪 TESTING VACCINATION WORKFLOW");
console.log("Input:", testVaccination);

// Simulate vaccine selection logic
function selectVaccineType(input) {
  const situation = input.situation.toLowerCase();
  
  if (situation.includes('oferta') || situation.includes('regalo') || situation.includes('tentación')) {
    return { persona: 'catalina', caseId: `VACCINE-TEMPTATION-${input.department.toUpperCase()}` };
  }
  
  if (situation.includes('control') || situation.includes('proceso') || situation.includes('auditoría')) {
    return { persona: 'ana', caseId: `VACCINE-CONTROL-${input.department.toUpperCase()}` };
  }
  
  if (situation.includes('liderazgo') || situation.includes('equipo') || situation.includes('decisión')) {
    return { persona: 'carlos', caseId: `VACCINE-LEADERSHIP-${input.department.toUpperCase()}` };
  }
  
  return { persona: 'mentor', caseId: `VACCINE-GENERAL-${input.department.toUpperCase()}` };
}

// Test vaccine selection
const vaccine = selectVaccineType(testVaccination);
console.log("Selected Vaccine:", vaccine);

// Test immunity calculation
function calculateImmunityLevel(riskLevel, vaccinationType, executionTime) {
  let baseImmunity = 60;
  
  if (riskLevel === 'alto') baseImmunity += 20;
  if (riskLevel === 'medio') baseImmunity += 10;
  
  if (vaccinationType === 'reactiva') baseImmunity += 15;
  if (vaccinationType === 'refuerzo') baseImmunity += 10;
  
  if (executionTime > 180000) baseImmunity += 10;
  
  return Math.min(95, Math.max(40, baseImmunity));
}

const immunity = calculateImmunityLevel(testVaccination.riskLevel, testVaccination.vaccinationType, 200000);
console.log("Immunity Level:", immunity + "%");

// Test vaccination ID generation
function generateVaccinationId(employeeId) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `VAC-${employeeId}-${timestamp}-${random}`.toUpperCase();
}

const vaccinationId = generateVaccinationId(testVaccination.employeeId);
console.log("Vaccination ID:", vaccinationId);

console.log("\n✅ VACCINATION WORKFLOW TEST COMPLETED");
console.log("🧪 Result: Employee vaccinated against corruption with", immunity + "% immunity");
