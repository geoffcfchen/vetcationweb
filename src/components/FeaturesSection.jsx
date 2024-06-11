import React, { useState } from "react";
import styled from "styled-components";
import easyWebp from "../images/easy.webp";
import easyPng from "../images/easy1@2x.png"; // Adjust the path
import fast1Webp from "../images/fast1.webp";
import fast1Png from "../images/fast1@2x.png"; // Adjust the path
import wordpress1Webp from "../images/wordpress1.webp";
import wordpress1Png from "../images/wordpress1@2x.png"; // Adjust the path
import Feature from "./Feature";

const FeaturesContainer = styled.section`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0rem 2rem;
`;

function FeaturesSection() {
  return (
    <FeaturesContainer>
      <header
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
        }}
      >
        <h2>A community to help you make the right decision for your pets</h2>
      </header>
      <Feature
        iconId="clock" // Use the ID of the icon from the sprite
        heading="Reserve your earliest appointments"
        text="Looking for early appointments or tired of waiting? Find the perfect solution at clinics near you! Book your earliest appointment today or join the waitlist to shorten your wait time. Don't wait, act now and experience hassle-free healthcare!"
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: fast1Webp,
          webp2x: fast1Webp,
          png: fast1Png,
          png2x: fast1Png,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1717708144.MP4?alt=media&token=490e6e2d-37f4-4527-880a-56e32cc3c771"
      />
      <Feature
        iconId="wordpress" // Use the ID of the icon from the sprite
        heading="Build strong connections with your doctor"
        text="Looking for an efficient way to manage your clients and stay connected with them? Our platform can help you do just that! With our user-friendly interface, you can manage your clients with ease and be available to them at all times. Don't let distance or time constraints get in the way of your business. Join now and take your client management to the next level!"
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: wordpress1Webp,
          webp2x: wordpress1Webp,
          png: wordpress1Png,
          png2x: wordpress1Png,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1717629711.MP4?alt=media&token=21e70d7f-101f-4412-a357-5ddcfb0a303a"
      />
      <Feature
        iconId="easy" // Use the ID of the icon from the sprite
        heading="Super Easy to get advice"
        text="Look no further! Our platform provides a unique opportunity to ask veterinarians questions and gain a veterinary perspective on your furry friend's well-being. Join now to ensure your pet receives the best care possible!"
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: easyWebp,
          webp2x: easyWebp,
          png: easyPng,
          png2x: easyPng,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1717710227.MP4?alt=media&token=7e0b7e77-0afa-4c11-a224-a2fc93b82386"
      />
      <Feature
        iconId="easy" // Use the ID of the icon from the sprite
        heading="Discover Expert Vet Insights"
        text="Explore a unique platform designed exclusively for pet owners seeking trustworthy veterinary advice. At our community space, you can post your pet health queries and have them addressed by professional veterinarians. While not all questions may receive answers, the insights shared here aim to empower you with the knowledge needed to make informed medical decisions for your pets. Remember, further questions aren't supported, reinforcing a focused and educational exchange."
        linkText="Learn More"
        linkHref="#"
        image={{
          webp: easyWebp,
          webp2x: easyWebp,
          png: easyPng,
          png2x: easyPng,
        }}
        videoSrc="https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/videos%2FRPReplay_Final1718143301.MP4?alt=media&token=88be2468-48ff-4358-b25a-0fdbbd1eb589"
      />
    </FeaturesContainer>
  );
}

export default FeaturesSection;
