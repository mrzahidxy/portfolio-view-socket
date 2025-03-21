import Visit from "./visitSchema";

export const readVisitCount = async () => {
  let visitDoc = await Visit.findOne();

  if (visitDoc) {
    return visitDoc.count;
  }

  return 0;
};

export const incrementVisitCount = async () => {
  await Visit.findOneAndUpdate({}, { $inc: { count: 1 } }, { upsert: true });
};
