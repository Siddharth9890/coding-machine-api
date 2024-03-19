import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: process.env.AWS_SQS_REGION });

export const sendMessage = async (
  messageBody: number,
  submissionId: number
) => {
  try {
    const command = new SendMessageCommand({
      QueueUrl: process.env.AWS_SQS_QUEUE_URL,
      MessageBody: messageBody.toString(),
      MessageDeduplicationId: submissionId.toString(),
      MessageGroupId: "code",
    });
    const { MessageId } = await sqsClient.send(command);
    console.log(`Message ${MessageId} successfully.`);
  } catch (error) {
    console.error("Error sending sqs message:", error);
    throw error;
  }
};
