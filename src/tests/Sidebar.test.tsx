import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { expect, it } from "vitest"
import '@testing-library/jest-dom';
import { describe } from "node:test";
import Sidebar from "../../common/components/sidebar/Sidebar";
import ContextProvider from "../../common/contexts/ContextProvider";
import userEvent from "@testing-library/user-event";


const renderSidebar = (path : string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ContextProvider>
        <Sidebar />
      </ContextProvider>
    </MemoryRouter>
  );

describe('Sidebar text', () => {
  it('renders organization sidebar items when on organization page', () => {
    renderSidebar('/dashboard/organization')

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
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

    renderSidebar('/')

    const nav = screen.getByRole('navigation');
    fireEvent.mouseEnter(nav);

    const text = screen.getByText(/Home/i).closest('.nav-menu-item-container');
    expect(text?.className).toContain('nav-menu-item-container active selected');

    fireEvent.mouseLeave(nav);
    expect(text?.className).toContain('nav-menu-item-container selected')
  })
})

