import { FC, Suspense } from 'react';
import { useSession } from 'next-auth/client';
import { Block } from 'baseui/block';
import { useStyletron } from 'baseui';

import { FullPageLoader } from 'components';
import { Navbar } from './Navbar';
import { Container } from './Container';
import { Content } from './Content';
import { UserSearch } from './UserSearch';
import { ConversationsList } from './ConversationsList';

export const Dashboard: FC = ({ children }) => {
  const [session, loading] = useSession();
  const [css] = useStyletron();
  const isLogged = !!session;

  return (
    <Content>
      <Block height="100vh">
        <Navbar />
        <Suspense fallback={<FullPageLoader />}>
          {loading ? (
            <FullPageLoader />
          ) : (
            <Container>
              {isLogged && <ConversationsList />}
              <div
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  minHeight: '100%',
                })}
              >
                <div>
                  {isLogged && <UserSearch />}
                  {children}
                </div>
              </div>
            </Container>
          )}
        </Suspense>
      </Block>
    </Content>
  );
};
