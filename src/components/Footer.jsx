import React, { useState, useEffect } from "react";
import { MdExpandMore, MdChevronRight } from "react-icons/md";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background: #232323;
  color: #7b858b;
  padding: 1rem 5.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GridContainer = styled.div`
  display: flex; // Changed from grid to flex to control row vs column layout
  flex-direction: row; // Default to row layout
  flex-wrap: wrap; // Allow wrapping for responsive behavior
  width: 100%;
  max-width: 1140px;
  gap: 2rem;
  justify-content: space-between; // Space items evenly

  @media (max-width: 768px) {
    flex-direction: column; // Change to column layout on narrow screens
  }
`;

const Section = styled.div`
  flex: 1; // Each section takes equal space
  padding: 1rem;
  border-bottom: none; // No border by default

  @media (max-width: 768px) {
    border-bottom: 1px solid #393939; // Apply border on narrow screens
    &:last-child {
      border-bottom: none;
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Heading = styled.h2`
  color: #fff;
  font-size: 1rem;
  text-transform: uppercase;
`;

const Content = styled.div`
  margin-top: 1rem;

  // Always show content on wide screens
  @media (min-width: 769px) {
    display: block;
  }

  // Conditionally show content on smaller screens based on $isOpen
  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  }
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
`;

const LinkItem = styled.li`
  margin-bottom: 0.5rem;

  a {
    color: #777;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #fff;
    }
  }
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  font-size: 24px;
  color: #fff;

  @media (min-width: 769px) {
    display: none; // Icon is hidden on wide screens
  }
`;

const FooterSection = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleOpen = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <Section>
      <Header onClick={toggleOpen}>
        <Heading>{title}</Heading>
        <Icon>{isOpen ? <MdExpandMore /> : <MdChevronRight />}</Icon>
      </Header>
      <Content $isOpen={isOpen}>
        <LinkList>
          {links.map((link, index) => (
            <LinkItem key={index}>
              <a href={link.url}>{link.text}</a>
            </LinkItem>
          ))}
        </LinkList>
      </Content>
    </Section>
  );
};

const Footer = () => {
  const footerData = [
    // {
    //   title: "Products",
    //   links: [
    //     { text: "Website Hosting", url: "#" },
    //     { text: "Free Automated Wordpress Migrations", url: "#" },
    //   ],
    // },
    // {
    //   title: "Company",
    //   links: [
    //     { text: "About", url: "#" },
    //     { text: "Affiliates", url: "#" },
    //     { text: "Blog", url: "#" },
    //   ],
    // },
    // {
    //   title: "Support",
    //   links: [
    //     { text: "Contact", url: "#" },
    //     { text: "Knowledge Base", url: "#" },
    //     { text: "FAQ", url: "#" },
    //   ],
    // },
    // {
    //   title: "Domains",
    //   links: [
    //     { text: "Domain Checker", url: "#" },
    //     { text: "Domain Transfer", url: "#" },
    //     { text: "Free Domain", url: "#" },
    //   ],
    // },
    {
      title: "Legal",
      links: [
        { text: "Privacy Policy", url: "/privacy-policy" },
        {
          text: "SMS Terms & Conditions",
          url: "/SMSTerms",
        },
      ],
    },
  ];

  return (
    <FooterContainer>
      <GridContainer>
        {footerData.map((section, index) => (
          <FooterSection
            key={index}
            title={section.title}
            links={section.links}
          />
        ))}
      </GridContainer>
    </FooterContainer>
  );
};

export default Footer;
