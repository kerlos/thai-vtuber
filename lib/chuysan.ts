export async function submitChannel(channelId: string, channelType: string) {
    try {
      const body = JSON.stringify({
        channel_id: channelId,
        type: channelType,
      });

      const response = await fetch(
        'https://us-central1-thaivtuberranking.cloudfunctions.net/postChannelRequest',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to submit channel: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Error submitting channel:', error);
      throw error;
    }
  }