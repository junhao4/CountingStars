import { act, fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import '@testing-library/jest-dom';
import Sidebar from "../common/components/sidebar/Sidebar";
import { SessionContext } from "../common/contexts/SessionContext";
import { OrgContext } from "../common/contexts/OrgContext";


const renderSidebar = async (path: string) =>
  await render(
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

    const nav = screen.getByRole('navigation');
    fireEvent.mouseEnter(nav);

    const text = screen.getByText(/Home/i).closest('.nav-menu-item');
    expect(text?.className).toContain('nav-menu-item active selected');

    fireEvent.mouseLeave(nav);
    expect(text?.className).toContain('nav-menu-item selected')
  })
})

