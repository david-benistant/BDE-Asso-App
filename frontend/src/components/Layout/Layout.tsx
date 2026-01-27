import { useState, type JSX } from "react";
import Sidebar from "./SideBar/Sidebar";
import TopBar from "./Topbar/TopBar";

const Layout = ({ children, onSearch, customButton }: { children: JSX.Element, onSearch?: (value: string) => void; customButton?: { text: string, icon: React.ReactNode, onClick: () => void } }) => {
    const [sideBarOpen, setSideBarOpen] = useState(false);

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div className="flex fixed translate-y-14">
                <Sidebar
                    open={sideBarOpen}
                    onClose={() => setSideBarOpen(false)}
                />
                {/* calc(100vh-calc(var(--spacing)*10)) */}

                <div className="relative md:fixed md:left-[calc(var(--spacing)*40)] md:w-[calc(100vw-calc(var(--spacing)*40))] h-[calc(100vh-calc(var(--spacing)*14))] ">

                    <div className="flex-1 w-full h-full overflow-y-auto">
                        <main>{children}</main>
                    </div>
                </div>
            </div>
            <TopBar setSideBarOpen={setSideBarOpen} onSearch={onSearch} customButton={customButton} />
            {sideBarOpen && (
                <div
                    onClick={() => setSideBarOpen(false)}
                    className="fixed left-40 inset-0 md:hidden"
                />
            )}
        </div>
    );
};

export default Layout;
