"use strict";

import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const usersRef = collection(db, "users");

/**
 * Function to create a new user in the database.
 * @param {Object} userData The data of the user to be created
 * @returns {Object} Object indicating success or failure and optional data/message
 */
const createUser = async (userData) => {
  try {
    const res = await addDoc(usersRef, userData);
    return { success: true, data: res };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: error };
  }
};

/**
 * Function to get a user from the database based on their email.
 * @param {string} userEmail The email of the user to retrieve
 * @returns {Object} Object indicating success or failure and optional data/message
 */
const getUser = async (userEmail) => {
  try {
    const userSnapshot = await getDocs(
      query(usersRef, where("email", "==", userEmail))
    );
    if (userSnapshot.empty) {
      return { success: false, message: "User not found" };
    }
    const userData = userSnapshot.docs.map((doc) => doc.data());
    return { success: true, data: userData };
  } catch (error) {
    console.error("Error getting user:", error);
    return { success: false, error: error };
  }
};

/**
 * Function to edit an existing user in the database.
 * @param {string} userEmail The email of the user to be edited
 * @param {Object} newData The new data to update for the user
 * @returns {Object} Object indicating success or failure and optional message
 */
const editUser = async (userEmail, newData) => {
  try {
    const userSnapshot = await getDocs(
      query(usersRef, where("email", "==", userEmail))
    );
    if (userSnapshot.empty) {
      return { success: false, message: "User not found" };
    }
    const userDoc = userSnapshot.docs[0];
    await updateDoc(userDoc.ref, newData);
    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: error };
  }
};

export { createUser, getUser, editUser };
