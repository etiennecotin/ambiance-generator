export const treat = sensorList => {
  let node = [];
  node = sensorList.reduce((acc, sensor) => {
    if (acc[sensor.nativeNodeId]) {
      acc[sensor.nativeNodeId] = [...acc[sensor.nativeNodeId], sensor];
    } else {
      acc[sensor.nativeNodeId] = [sensor];
    }
    return acc;
  }, []);
  return node
};
