import { render, screen } from '@testing-library/react';
import { ActiveLink } from '.';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      };
    },
  };
});

describe('Active Link component', () => {
  it('renders correctly', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('correctly adds active class', () => {
    render(
      <>
        <ActiveLink href="/" activeClassName="active">
          <a>Home</a>
        </ActiveLink>
        <ActiveLink href="/dashboard" activeClassName="active">
          <a>Dashboard</a>
        </ActiveLink>
      </>,
    );

    expect(screen.getByText('Home')).toHaveClass('active');
    expect(screen.getByText('Dashboard')).not.toHaveClass('active');
  });
});
