"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <span
      className={light ? "brand-lockup brand-lockup-light" : "brand-lockup"}
      aria-label="NadiVedas — Your Destiny. 2000 Years Old."
    >
      <Image
        className="brand-logo-image"
        src="/images/nadivedas-logo-full.png"
        alt="NadiVedas — Your Destiny. 2000 Years Old."
        width={1276}
        height={553}
        unoptimized
        priority
      />
    </span>
  );
}

export function SiteHeader({ showBooking = true }: { showBooking?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link href="/" className="real-logo">
        <BrandLogo />
      </Link>
      <nav className={open ? "open" : ""}>
        <Link href="/about">What is Nadi?</Link>
        <Link href="/nadis">Nadis</Link>
        <Link href="/how-it-works">How it works</Link>
        <Link href="/reviews">Reviews</Link>
        <Link href="/blogs">Blogs</Link>
        {showBooking && <Link href="/journey" className="header-book">
          Find my leaf · ₹999 <span>→</span>
        </Link>}
      </nav>
      <button
        aria-label="Open navigation"
        className="site-menu"
        onClick={() => setOpen(!open)}
      >
        {open ? "×" : "☰"}
      </button>
    </header>
  );
}

export function SiteFooter({ showSticky = true }: { showSticky?: boolean }) {
  return (
    <>
      {showSticky && <div className="sticky-mobile-cta">
        <Link href="/journey">Begin leaf search · ₹999</Link>
      </div>}
      <footer className="site-footer">
        <div className="footer-brand">
          <BrandLogo light />
          <p>
            Ancient palm-leaf wisdom,
            <br />
            guided with care for the modern seeker.
          </p>
        </div>
        <div>
          <b>Discover</b>
          <Link href="/about">What is Nadi &amp; how it works</Link>
          <Link href="/chapters">13 Chapters</Link>
          <Link href="/pdf-reports">Nadi PDF reports</Link>
          <Link href="/nadis">Nadi traditions</Link>
        </div>
        <div>
          <b>Trust</b>
          <Link href="/reviews">Seeker stories</Link>
          <Link href="/blog">Journal</Link>
          <Link href="/blogs">Blogs</Link>
          <Link href="/blogs/reviews">Reviews Blog</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/refund-policy">Refund policy</Link>
        </div>
        <div>
          <b>Affiliate</b>
          <Link href="/affiliate">Become a partner</Link>
          <a href="https://love.nadivedas.com/partner-login">Partner login</a>
        </div>
        <div>
          <b>Begin</b>
          <Link href="/journey">Book leaf finding</Link>
          <a href="https://wa.me/919992229463">WhatsApp care</a>
          <a href="mailto:support@nadivedas.com">support@nadivedas.com</a>
        </div>
        <small>
          © 2026 NadiVedas · Online readings worldwide · Guidance is spiritual
          in nature
        </small>
      </footer>
    </>
  );
}
