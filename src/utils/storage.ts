import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_DOCTORS } from '../services/mockData';

const DOCTORS_KEY = '@medscribe_doctors';

export const storage = {
    // 1. Saare doctors load karna
    getDoctors: async () => {
        try {
            const savedDoctors = await AsyncStorage.getItem(DOCTORS_KEY);
            if (savedDoctors !== null) {
                return JSON.parse(savedDoctors);
            }
            // Agar storage khali hai to default mock data dikhao
            return MOCK_DOCTORS;
        } catch (e) {
            console.error("Error loading doctors", e);
            return MOCK_DOCTORS;
        }
    },

    // 2. Naya doctor save karna (Single)
    saveDoctor: async (newDoctor: any) => {
        try {
            const currentDoctors = await storage.getDoctors();
            const updatedList = [newDoctor, ...currentDoctors];
            await AsyncStorage.setItem(DOCTORS_KEY, JSON.stringify(updatedList));
            return updatedList;
        } catch (e) {
            console.error("Error saving doctor", e);
        }
    },

    // 3. Poori list save karna (Update ya Delete ke liye use hoga)
    saveAllDoctors: async (doctorsList: any[]) => {
        try {
            await AsyncStorage.setItem(DOCTORS_KEY, JSON.stringify(doctorsList));
        } catch (e) {
            console.error("Error saving all doctors", e);
        }
    },

    // Storage ko poora saaf karne ke liye (Optional debugging tool)
    clearStorage: async () => {
        try {
            await AsyncStorage.removeItem(DOCTORS_KEY);
        } catch (e) {
            console.error("Error clearing storage", e);
        }
    }
};