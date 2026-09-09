# Electrical & Connectors

Each joint has four connectors on its back shell: two for the 60 A power
chain (XT90, in + out) and two for CAN bus and IO (Ethernet RJ45).

## Wiring

<div>
    <img src="/assets/diagrams/joint_electronics.png" alt="wiring" style={{width: '60%', borderRadius: '6px', marginBottom: '12px'}} />
</div>


## Connector selection rationale

No single connector family handles both 60 A power and CAN bus
simultaneously. The two-connector-per-side approach is the practical outcome:

| Function | Connector | Rating |
|----------|-----------|--------|
| Power (50 A) | `XT60` | 50 A continuous |
| CAN bus | Ethernet Splitter | Two-wire CAN + shield |

