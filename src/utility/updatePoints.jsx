import { getAuth } from "firebase/auth";
import { getFirestore, doc, runTransaction } from "firebase/firestore";

// Firebase instances (Assuming you have already initialized Firebase elsewhere in your project)
const auth = getAuth();
const firestore = getFirestore();

async function updatePoints(userId, points, type) {
  if (userId === auth.currentUser?.uid && type === "received") {
    return;
  }

  const userRef = doc(firestore, "customers", userId);
  const field = `${type}Points`;

  try {
    await runTransaction(firestore, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("User document does not exist!");
      }

      const currentTotalPoints = userDoc.data().totalPoints || 0;
      const currentFieldPoints = userDoc.data()[field] || 0;
      let newTotalPoints = currentTotalPoints + points;
      let newFieldPoints = currentFieldPoints + points;

      // Ensure points do not go negative
      if (newTotalPoints < 0) {
        newTotalPoints = 0;
      }
      if (newFieldPoints < 0) {
        newFieldPoints = 0;
      }

      transaction.update(userRef, {
        totalPoints: newTotalPoints,
        [field]: newFieldPoints,
      });
    });

    console.log("Points updated successfully!");
  } catch (e) {
    console.error("Points update failure:", e);
  }
}

export default updatePoints;
