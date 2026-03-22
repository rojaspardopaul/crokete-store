import React, { useState, useMemo, useCallback, createContext } from "react";

// create context
export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("need");

  // Stable callbacks using updater pattern — prevents unnecessary re-renders
  const toggleCartDrawer = useCallback(() => setCartDrawerOpen((prev) => !prev), []);
  const closeCartDrawer = useCallback(() => setCartDrawerOpen(false), []);

  const toggleCategoryDrawer = useCallback(() => setCategoryDrawerOpen((prev) => !prev), []);
  const closeCategoryDrawer = useCallback(() => setCategoryDrawerOpen(false), []);

  const toggleDrawer = useCallback(() => setDrawerOpen((prev) => !prev), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleChangePage = useCallback((p) => {
    setCurrentPage(p);
  }, []);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      isModalOpen,
      toggleModal,
      closeModal,
      currentPage,
      setCurrentPage,
      handleChangePage,
      isLoading,
      setIsLoading,
      drawerOpen,
      toggleDrawer,
      closeDrawer,
      setDrawerOpen,
      cartDrawerOpen,
      toggleCartDrawer,
      closeCartDrawer,
      setCartDrawerOpen,
      categoryDrawerOpen,
      toggleCategoryDrawer,
      closeCategoryDrawer,
    }),

    [
      activeTab,
      drawerOpen,
      isModalOpen,
      currentPage,
      isLoading,
      cartDrawerOpen,
      categoryDrawerOpen,
    ]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
