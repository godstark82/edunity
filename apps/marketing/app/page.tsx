import NavBar from "../components/NavBar";

/**
 * Marketing page component that renders a red-text container with the navigation bar.
 *
 * Renders a top-level <div className="text-red"> containing the NavBar component. This component
 * has no props and produces the page's static header area.
 *
 * @returns The JSX element for the page contents.
 */
export default function Home() {
  return (
    <div className="text-red">
      <NavBar />
    </div>
  );
}
