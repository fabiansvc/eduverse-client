"use strict";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const teachersRef = collection(db, "teachers");

/**
 * Function to check if a user is a teacher based on their email.
 * @param {string} email The email of the user to check
 * @returns {Object} Object indicating success or failure and the type of user
 */
const getTeacher = async (email) => {
  try {
    const result = await getDocs(
      query(teachersRef, where("email", "==", email))
    );
    if (result.empty) {
      return { success: true, type: "user" };
    } else {
      return { success: true, type: "teacher" };
    }
  } catch (error) {
    console.error("Error getting teacher:", error);
    return { success: false, error: error };
  }
};

export { getTeacher };
