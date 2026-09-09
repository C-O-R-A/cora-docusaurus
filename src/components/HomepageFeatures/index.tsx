import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Png: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Focus on What Matters',
    Png: require('@site/static/assets/logos/cora_rsa.png').default,
    description: (
      <>
        CORA (Collaborative Open Robotic Arms) is a modular cobot platform developed at RSA. It is designed to be easy to set up and use, allowing you to focus on
        your research and development.
      </>
    ),
  },
  {
    title: 'Open Source',
    Png: require('@site/static/assets/robots/exploded2.png').default,
    description: (
      <>
        Open source hardware and software, allowing you to customize and extend the
        platform to your needs.
      </>
    ),
  },
];

function Feature({title, Png, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={Png} className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
