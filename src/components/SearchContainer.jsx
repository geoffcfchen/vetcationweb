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
import { firestore } from "../firebase";
import GlobalContext from "../context/GlobalContext";
import ListUser from "./ListUser/ListUser";
import TypesenseClient from "../TypesenseClient";
import { AiOutlineCloseCircle } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";

const per_page_num = 20;

const SearchContainer = ({ roleFilter }) => {
  const { userData } = useContext(GlobalContext);
  const [customers, setCustomers] = useState([]);
  const [lastVisibleCustomer, setLastVisibleCustomer] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inSearchMode, setInSearchMode] = useState(false);

  // Fetch initial data if not in search mode
  useEffect(() => {
    if (!inSearchMode) {
      fetchInitialCustomers();
    }
  }, [inSearchMode, roleFilter]);

  const fetchInitialCustomers = async () => {
    setIsLoading(true);

    let customersQuery = query(
      collection(firestore, "customers"),
      where("hasCompletedProfile", "==", true),
      orderBy("uid"),
      limit(10)
    );

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
      const initialCustomers = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((customer) => customer?.uid !== userData?.uid);

      setCustomers(initialCustomers);
      setLastVisibleCustomer(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === 10);
    } catch (error) {
      console.error("Error fetching initial customers:", error);
    }

    setIsLoading(false);
  };

  const fetchMoreCustomers = async () => {
    console.log("test");
    if (!lastVisibleCustomer || isLoading) return;

    setIsLoading(true);
    let customersQuery = query(
      collection(firestore, "customers"),
      where("hasCompletedProfile", "==", true),
      orderBy("uid"),
      startAfter(lastVisibleCustomer),
      limit(10)
    );

    if (roleFilter) {
      customersQuery = query(
        customersQuery,
        where("role.label", "==", roleFilter)
      );
    }

    try {
      const querySnapshot = await getDocs(customersQuery);
      const newCustomers = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((customer) => customer?.uid !== userData?.uid);

      setCustomers((prevCustomers) => [...prevCustomers, ...newCustomers]);
      setLastVisibleCustomer(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === 10);
    } catch (error) {
      console.error("Error fetching more customers:", error);
    }

    setIsLoading(false);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setInSearchMode(Boolean(searchQuery));

    if (searchQuery) {
      try {
        const searchParameters = {
          q: searchQuery,
          query_by: "displayName, email, userName",
          page: 1,
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

        const searchResults = response.hits.map((hit) => hit.document);
        setCustomers(searchResults);
        setHasMore(response.hits.length === per_page_num);
      } catch (error) {
        console.error("Search error:", error);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const timerId = setTimeout(handleSearch, 500);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

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
      <div id="scrollableDiv2" style={{ height: "100vh", overflow: "auto" }}>
        <InfiniteScroll
          dataLength={customers.length}
          next={fetchMoreCustomers}
          hasMore={hasMore}
          loader={<Loader>Loading...</Loader>}
          endMessage={<NoResults>No more customers to display</NoResults>}
          scrollableTarget="scrollableDiv2"
        >
          {customers.map((customer) => (
            <ListUser key={customer.id} user={customer} canFollow />
          ))}
        </InfiniteScroll>
      </div>
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

const Loader = styled.div`
  text-align: center;
  color: grey;
`;

const NoResults = styled.div`
  text-align: center;
  color: grey;
`;
