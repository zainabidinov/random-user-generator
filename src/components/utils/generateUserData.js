import { allFakers } from "@faker-js/faker";
import seedrandom from "seedrandom";

export const generateUserData = (region, numberOfUsers, seed, numOfErrors) => {
  const fakeData = [];
  const random = seedrandom(seed);
  const fakeUser = allFakers[region];

  if (!fakeUser) {
    console.error("Invalid region:", region);
    return fakeData;
  }

  fakeUser.seed(seed);

  for (let i = 0; i < numberOfUsers; i++) {
    const index = i + 1;
    const id = fakeUser.string.uuid();
    const name = fakeUser.person.fullName();
    const address = fakeUser.location.streetAddress({
      useFullAddress: true,
    });
    const phone = fakeUser.phone.number();

    const initialStr = {
      key: index,
      id: id,
      name: name,
      address: address,
      phone: phone,
    };

    if (numOfErrors > 0) {
      fakeData.push({
        ...initialStr,
        name: generateUserError(name, numOfErrors, random),
        address: generateUserError(address, numOfErrors, random),
        phone: generateUserError(phone, numOfErrors, random),
      });
    } else {
      fakeData.push(initialStr);
    }
  }

  return fakeData;
};

export const generateUserError = (inputString, errNum, seed) => {
  const random = seed;
  let modifiedString = "";

  const parts = inputString.split(" ");

  parts.forEach((part) => {
    let modifiedPart = part;

    const numberOfErrors = Math.floor(errNum);

    for (let i = 0; i < numberOfErrors; i++) {
      const errorType = getRandomErrorFunctionName();
      modifiedPart = applyError(modifiedPart, errorType, random);
    }

    const remainingErrors = errNum - numberOfErrors;
    if (random.quick() < remainingErrors) {
      const errorType = getRandomErrorFunctionName();
      modifiedPart = applyError(modifiedPart, errorType, random);
    }

    modifiedString += modifiedPart + " ";
  });

  return modifiedString.trim();
};

const getRandomErrorFunctionName = () => {
  const errorFunctions = ["deleteCharacter", "addCharacter", "swapCharacters"];
  const randomIndex = Math.floor(Math.random() * errorFunctions.length);
  return errorFunctions[randomIndex];
};

const applyError = (inputString, errorType, random) => {
  switch (errorType) {
    case "deleteCharacter":
      return deleteCharacter(inputString, random);
    case "addCharacter":
      return addCharacter(inputString, random);
    case "swapCharacters":
      return swapCharacters(inputString, random);
    default:
      return inputString;
  }
};

const deleteCharacter = (inputString, random) => {
  if (inputString.length <= 8) {
    return inputString;
  }
  const index = Math.floor(random.quick() * inputString.length);
  return inputString.slice(0, index) + inputString.slice(index + 1);
};

const addCharacter = (inputString, random) => {
  if (inputString.length >= 8) {
    return inputString;
  }
  const charList =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomChar = charList.charAt(
    Math.floor(random.quick() * charList.length)
  );
  const index = Math.floor(random.quick() * inputString.length);
  return inputString.slice(0, index) + randomChar + inputString.slice(index);
};

const swapCharacters = (inputString, random) => {
  if (inputString.length <= 1) {
    return inputString;
  }
  const index = Math.floor(random.quick() * (inputString.length - 1));
  return (
    inputString.slice(0, index) +
    inputString.charAt(index + 1) +
    inputString.charAt(index) +
    inputString.slice(index + 2)
  );
};
