import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext({
  activeTab: "",
  setActiveTab: () => {},
});

const Tabs = ({ defaultValue, value, onValueChange, children, className = "" }) => {
  const [activeTabState, setActiveTabState] = useState(defaultValue || "");
  const activeTab = value !== undefined ? value : activeTabState;
  const setActiveTab = (newValue) => {
    if (value === undefined) {
      setActiveTabState(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    role="tablist"
    className={cn(
      "inline-flex items-center justify-center rounded-lg p-1",
      "text-gray-300 bg-gray-800/50",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(
  ({ className = "", value, children, disabled = false, ...props }, ref) => {
    const { activeTab, setActiveTab } = useContext(TabsContext);
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        aria-controls={`panel-${value}`}
        disabled={disabled}
        onClick={() => setActiveTab(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5",
          "text-md font-medium transition-all focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50 m-2",
          isActive && "bg-white text-black shadow-sm",
          !isActive && "hover:bg-gray-100 hover:text-gray-700 text-white",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(
  ({ className = "", value, children, ...props }, ref) => {
    const { activeTab } = useContext(TabsContext);
    const isActive = activeTab === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`panel-${value}`}
        className={cn(
          "mt-2 focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

// Utility function for class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export { Tabs, TabsList, TabsTrigger, TabsContent };