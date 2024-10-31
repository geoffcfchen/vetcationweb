// src/components/SearchContainer.jsx
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../firebase"; // Ensure this is configured for Firebase modular SDK
import GlobalContext from "../context/GlobalContext";
import ListUser from "./ListUser/ListUser";
import TypesenseClient from "../TypesenseClient";
import { AiOutlineCloseCircle } from "react-icons/ai";

const per_page_num = 20;

const SearchContainer = ({ roleFilter }) => {
  const { userData } = useContext(GlobalContext);
  const [customers, setCustomers] = useState([]);
  const [lastVisibleCustomer, setLastVisibleCustomer] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inSearchMode, setInSearchMode] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearchResults, setHasMoreSearchResults] = useState(true);

  // Initial load for customers when not in search mode
  useEffect(() => {
    const fetchData = async () => {
      if (!inSearchMode) {
        setIsLoading(true);

        let customersQuery = query(
          collection(firestore, "customers"),
          where("hasCompletedProfile", "==", true), // Adding filter for completed profiles
          orderBy("uid"),
          limit(10)
        );

        // Apply role filter if provided
        if (roleFilter) {
          if (roleFilter === "LicensedTech") {
            customersQuery = query(
              customersQuery,
              where("role.label", "==", "Tech"),
              where("licenseNumber", ">", "")
            );
          } else {
            customersQuery = query(
              customersQuery,
              where("role.label", "==", roleFilter)
            );
          }
        }

        try {
          const querySnapshot = await getDocs(customersQuery);
          const allCustomers = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((customer) => customer?.uid !== userData?.uid); // Client-side filtering

          setLastVisibleCustomer(
            querySnapshot.docs[querySnapshot.docs.length - 1]
          );
          setCustomers(allCustomers);
          setHasMore(querySnapshot.docs.length === 10); // Check if there's more data to load
        } catch (error) {
          console.error("Error fetching customers:", error);
        }

        setIsLoading(false);
      }
    };

    fetchData();
  }, [inSearchMode, roleFilter]);

  // Debounced search effect
  useEffect(() => {
    const timerId = setTimeout(() => {
      handleSearch();
    }, 500); // Debounce with 500 ms delay
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Search function
  const handleSearch = async () => {
    setIsLoading(true);
    setSearchPage(1);
    setInSearchMode(Boolean(searchQuery));

    if (searchQuery) {
      try {
        const searchParameters = {
          q: searchQuery,
          query_by: "displayName, email, userName",
          page: searchPage,
          per_page: per_page_num,
        };

        if (roleFilter) {
          searchParameters.filter_by = `role.label:${roleFilter} && hasCompletedProfile:true`;
        } else {
          searchParameters.filter_by = `hasCompletedProfile:true`;
        }

        const response = await TypesenseClient.collections("customers")
          .documents()
          .search(searchParameters);

        const customers = response.hits.map((hit) => hit.document);
        setCustomers(customers);
        setHasMoreSearchResults(response.hits.length === per_page_num);
      } catch (error) {
        setCustomers([]);
        setLastVisibleCustomer(null);
        setHasMore(true);
        setInSearchMode(false);
        console.error("Search error:", error);
      }
    }
    setIsLoading(false);
  };

  // Load more function for pagination
  const loadMoreCustomers = async () => {
    if (
      isLoading ||
      (!hasMore && !inSearchMode) ||
      (!hasMoreSearchResults && inSearchMode)
    )
      return;

    setIsLoading(true);
    if (inSearchMode) {
      try {
        const nextPage = searchPage + 1;
        const newSearchParameters = {
          q: searchQuery,
          query_by: "displayName, email, userName",
          page: nextPage,
          per_page: per_page_num,
        };

        if (roleFilter) {
          newSearchParameters.filter_by = `role.label:${roleFilter} && hasCompletedProfile:true`;
        } else {
          newSearchParameters.filter_by = `hasCompletedProfile:true`;
        }

        const response = await TypesenseClient.collections("customers")
          .documents()
          .search(newSearchParameters);

        const newCustomers = response.hits.map((hit) => hit.document);
        setCustomers((prevCustomers) => [...prevCustomers, ...newCustomers]);
        setHasMoreSearchResults(response.hits.length === 10);
        setSearchPage(nextPage);
      } catch (error) {
        console.error("Search pagination error:", error);
      }
    } else {
      let customersQuery = query(
        collection(firestore, "customers"),
        where("hasCompletedProfile", "==", true),
        orderBy("uid"),
        startAfter(lastVisibleCustomer || 0),
        limit(10)
      );

      if (roleFilter) {
        customersQuery = query(
          customersQuery,
          where("role.label", "==", roleFilter)
        );
      }

      const querySnapshot = await getDocs(customersQuery);
      if (querySnapshot.docs.length < 10) setHasMore(false);

      const newCustomers = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((customer) => customer?.uid !== userData?.uid);

      setLastVisibleCustomer(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setCustomers((prevCustomers) => [...prevCustomers, ...newCustomers]);
    }
    setIsLoading(false);
  };

  const getPlaceholder = () => {
    switch (roleFilter) {
      case "Doctor":
        return "Doctor's name, email, or bio";
      case "LicensedTech":
        return "Licensed tech's name, email, or bio";
      default:
        return "Name, Email, or Bio";
    }
  };

  return (
    <Container>
      <SearchInput
        type="text"
        placeholder={getPlaceholder()}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <ClearButton onClick={() => setSearchQuery("")}>
          <AiOutlineCloseCircle size={20} />
        </ClearButton>
      )}
      <ResultsContainer>
        {customers.map((customer) => (
          <ListUser key={customer.id} user={customer} canFollow />
        ))}
        {isLoading && <Loader>Loading...</Loader>}
        {!isLoading && customers.length === 0 && (
          <NoResults>No results found</NoResults>
        )}
      </ResultsContainer>
      {hasMore && !isLoading && (
        <LoadMoreButton onClick={loadMoreCustomers}>Load More</LoadMoreButton>
      )}
    </Container>
  );
};

export default SearchContainer;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-bottom: 1rem;
`;

const ClearButton = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  color: #000;
  cursor: pointer;
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Loader = styled.div`
  text-align: center;
  color: grey;
`;

const NoResults = styled.div`
  text-align: center;
  color: grey;
`;

const LoadMoreButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #1da1f2;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #0a85d9;
  }
`;
