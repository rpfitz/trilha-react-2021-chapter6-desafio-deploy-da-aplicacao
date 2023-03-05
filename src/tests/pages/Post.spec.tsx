import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

const post = {
  slug: 'fake-post',
  title: 'Fake Post',
  content: '<p>Content of fake post</p>',
  updatedAt: 'Nov 3 2021',
};

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />);

    expect(screen.getByText('Fake Post')).toBeInTheDocument();
    expect(screen.getByText('Content of fake post')).toBeInTheDocument();
  });

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: 'fake-post' },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/posts/preview/fake-post',
        }),
      }),
    );
  });

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'mock-subscription',
    } as any);

    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'Fake Post' }],
          content: [{ type: 'paragraph', text: 'Content of fake post' }],
        },
        last_publication_date: '11-03-2021',
      }),
    } as any);

    const response = await getServerSideProps({
      params: { slug: 'fake-post' },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'fake-post',
            title: 'Fake Post',
            content: '<p>Content of fake post</p>',
            updatedAt: '03 de novembro de 2021',
          },
        },
      }),
    );
  });
});
