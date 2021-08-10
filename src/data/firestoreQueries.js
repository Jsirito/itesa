import { db } from "../base";

export const getExercises = async () => {
  let exercises = await db.collection("exercises").get();
  return exercises.docs.map((exercise) => exercise.data());
};

export const getExercisesInCategory = async (category) => {
  const exercises = await db
    .collection("exercises")
    .where("category", "array-contains", category)
    .get();

  return exercises.docs.map((exercise) => exercise.data());
};

export const getCategories = async () => {
  const categories = await db.collection("categories").get();
  return categories.docs.map((category) => category.data());
};

export const getUser = async (userId) => {
  return db.collection("users").doc(userId).get();
};

export const addNewExercise = async (currentUser, currentExercise, reps) => {
  console.log("adding new exercise", currentUser);
  db.collection("users")
    .doc(currentUser.id)
    .update({
      ejerciciosRealizados: [
        ...currentUser.ejerciciosRealizados,
        { name: currentExercise.name, reps: reps, date: +new Date() },
      ],
    })
    .then(() => {
      // window.location = "/";
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};
