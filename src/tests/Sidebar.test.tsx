import { act, fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import Sidebar from "../common/components/sidebar/Sidebar";
import ContextProvider from "../common/contexts/ContextProvider";
import { SessionContext, SessionProvider } from "../common/contexts/SessionContext";
import { OrgContext } from "../common/contexts/OrgContext";


const renderSidebar = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      {/* <ContextProvider> */}
      <SessionContext.Provider value={{ session: null, user: null, setUser: () => { }, loading: false }}>
        <OrgContext.Provider value={{ org: null, setOrg: () => { }, loading: false }} >
          <Sidebar />
        </OrgContext.Provider>
      </SessionContext.Provider>
      {/* </ContextProvider> */}
    </MemoryRouter>
  );

describe('Sidebar text', () => {
  it('renders organization sidebar items when on organization page', () => {
    renderSidebar('/dashboard/organization')

    screen.logTestingPlaygroundURL()

    expect(screen.getByText(/Organization/i)).toBeInTheDocument();
    expect(screen.getByText(/Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Inventory/i)).toBeInTheDocument();
    expect(screen.getByText(/Logs/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  it('renders normal sidebar items when on home page', () => {
    renderSidebar('/')

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
})

describe('Sidebar actions', () => {
  it('expands on hover', () => {

    act(() => {
      renderSidebar('/')
    })

    screen.logTestingPlaygroundURL()

    const nav = screen.getByRole('navigation');
    fireEvent.mouseEnter(nav);

    const text = screen.getByText(/Home/i).closest('.nav-menu-item');
    expect(text?.className).toContain('nav-menu-item active selected');

    fireEvent.mouseLeave(nav);
    expect(text?.className).toContain('nav-menu-item selected')
  })
})

