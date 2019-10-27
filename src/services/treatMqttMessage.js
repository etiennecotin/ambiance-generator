export const analyseTopic = topic => {
  const splitedTopic = topic.split("/");
  return {
    request: splitedTopic[1],
    type: splitedTopic[2],
    nativeNodeId: splitedTopic[3],
    nativeSensorId: splitedTopic[4],
    resource: splitedTopic[5]
  };
};
