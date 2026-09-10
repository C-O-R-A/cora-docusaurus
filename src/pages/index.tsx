import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroOverlay} />
      <div className={clsx('container', styles.heroContent)}>
        <Heading as="h1" className={styles.heroTitle}>
          CORA
        </Heading>
        <p className={styles.heroSubtitle}>Configure, Build, Control</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/CORA">
            Get Started
          </Link>
          <Link
            className={clsx('button button--outline button--lg', styles.githubButton)}
            to="https://github.com/C-O-R-A"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="CORA" description="Configure, Build, Control — a modular cobot platform">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}