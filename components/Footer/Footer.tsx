import React from 'react'
import styles from './Footer.module.css'
import Link from 'next/link'
import { headers } from 'next/headers'

export default function Footer(){
  return <footer className={styles.footer}>
  2024 © Sara Serrano
  </footer>
}