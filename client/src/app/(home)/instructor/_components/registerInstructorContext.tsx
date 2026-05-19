"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  InitialInstructorData,
  InstructorData,
  instructorRegisterFormSchema,
} from "../zodTypes";

interface registerInstructorProps {
  registerFormData: InitialInstructorData;
  updateRegisterDataForm: (formData: Partial<InstructorData>) => void;
  dataLoaded: boolean;
  resetLocalStorage: () => void;
}

const defaultFormData: InstructorData = {
  occupation: [],
  specificSkills: [],
  yearsOfExpertise: 0,
  qualification: [],
  termsAndConditions: false,
  equipment: false,
  sampleContentUrl: "",
};

const registerInstructorContext = createContext<registerInstructorProps | null>(
  null
);

const REGISTER_INSTRUCTOR_DATA_KEY = "registerInstructorData";

export function RegisterInstructorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [registerFormData, setRegisterFormData] =
    useState<InitialInstructorData>(defaultFormData);
  const [dataLoaded, setDataLoaded] = useState(false);

  const updateRegisterDataForm = (formData: Partial<InstructorData>) => {
    setRegisterFormData((prevFormData) => ({
      ...prevFormData,
      ...formData,
    }));
  };

  useEffect(() => {
    const readFromLocalStorage = () => {
      const loadedDataString = localStorage.getItem(REGISTER_INSTRUCTOR_DATA_KEY);
      if (!loadedDataString) return;
      const validated = instructorRegisterFormSchema.safeParse(
        JSON.parse(loadedDataString)
      );

      if (validated.success) {
        console.log("the stored data", validated.data);
        setRegisterFormData(validated.data);
      } else {
        setRegisterFormData(defaultFormData);
      }
    };

    readFromLocalStorage();
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      saveDataToLocalStorage(registerFormData);
    }
  }, [registerFormData, dataLoaded]);

  function resetLocalStorage() {
    localStorage.removeItem(REGISTER_INSTRUCTOR_DATA_KEY);
    setRegisterFormData(defaultFormData);
  }

  const saveDataToLocalStorage = (currentFormData: InitialInstructorData) => {
    localStorage.setItem(
      REGISTER_INSTRUCTOR_DATA_KEY,
      JSON.stringify(currentFormData)
    );
  };

  return (
    <registerInstructorContext.Provider
      value={{
        registerFormData,
        updateRegisterDataForm,
        dataLoaded,
        resetLocalStorage,
      }}
    >
      {children}
    </registerInstructorContext.Provider>
  );
}

export const useRegisterInstructorContext = () => {
  const context = useContext(registerInstructorContext);
  if (!context) {
    throw new Error(
      "useRegisterInstructorContext must be used within a RegisterInstructorProvider"
    );
  }
  return context;
};
