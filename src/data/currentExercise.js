import { atom } from "recoil";

export const currentExerciseState = atom({
  key: "currentExerciceState",
  default: {
		category: [],
		image: "",
		name: "",
		needs: [],
		video: "",
		reps: 1
	}
})