import { useState, useEffect } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { useSession } from 'next-auth/client';
import Head from 'next/head';

import { Conversation } from 'components';
import { Conversation as ConversationType } from 'interfaces';
import { apiServer } from 'api';

const WS_ENDPOINT = 'ws://localhost:80';
interface Props {
  conversation: ConversationType;
}

const CurrentConversation: NextPage<Props> = ({ conversation }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [session] = useSession();

  const { id } = conversation;

  useEffect(() => {
    const wsClient = new WebSocket(WS_ENDPOINT);

    wsClient.onopen = () => {
      setWs(wsClient);

      wsClient?.send(
        JSON.stringify({
          event: 'openRoom',
          data: {
            conversationId: id,
            user: session?.userData.id,
          },
        }),
      );
    };
    wsClient.onclose = () => console.log('ws closed');

    return () => {
      wsClient.close();
    };
  }, [id, session?.userData.id]);

  return (
    <div>
      <Head>
        <title>Conversation</title>
      </Head>
      {!!ws && <Conversation ws={ws} conversation={conversation} />}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  params,
}) => {
  const { id } = params ?? {};

  const { data: conversation } = await apiServer(req).get<ConversationType>(
    `conversations/${id}`,
  );

  return {
    props: {
      conversation,
    },
  };
};

export default CurrentConversation;
