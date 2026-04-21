export interface User {
 id: string;
 name: string;
 email: string;
 carModel: string;
 carNumber: string;
 insuranceCompany: string;
 insurancePremium: number;
 points: number;
 safetyScore: number;
 carbonReduction: number; // in kg CO2
}

export interface DrivingEvent {
 id: string;
 type: 'hard_accel' | 'hard_brake' | 'speeding' | 'night_driving' | 'idling_reduction' | 'eco_driving';
 timestamp: string;
 location: string;
 scoreImpact?: number;
 carbonImpact?: number; // in kg CO2
}

export interface MonthlyReport {
 month: string;
 distance: number;
 safetyScore: number;
 carbonReduction: number;
 savings: number;
 events: DrivingEvent[];
 comparison: {
 trees: number;
 electricity: number;
 energy: number;
 };
}

export interface Product {
 id: string;
 name: string;
 price: number;
 category: 'fuel' | 'parking' | 'wash' | 'maintenance';
 image: string;
 description: string;
}
