import type { ServiceVisual as VisualKind } from "@/data/services";

/** Abstract service illustrations; the adjacent heading and copy carry meaning. */
export function ServiceVisual({ kind }: { kind: VisualKind }) {
  return (
    <div
      className={`service-visual service-visual--${kind}`}
      data-service-visual={kind}
      aria-hidden="true"
    >
      <svg viewBox="0 0 560 260" fill="none" focusable="false">
        {kind === "pipeline" && (
          <>
            <path className="service-wire" d="M56 130H504" pathLength="1" data-service-line />
            {[56, 222, 388].map((x, i) => (
              <g key={x} data-service-node>
                <rect className="service-pane" x={x} y={40} width="116" height="180" rx="3" />
                <path className="service-wire" d={`M${x + 16} 64h42`} />
                <circle
                  className={i === 2 ? "service-signal" : "service-pin"}
                  cx={x + 94}
                  cy="64"
                  r="3"
                />
                {Array.from({ length: 3 - i }, (_, j) => (
                  <g key={j} data-service-transfer={i === 2 ? "" : undefined}>
                    <rect
                      className={
                        i === 2 ? "service-ticket service-ticket--active" : "service-ticket"
                      }
                      x={x + 12}
                      y={88 + j * 38}
                      width="92"
                      height="28"
                      rx="2"
                    />
                    <path className="service-wire" d={`M${x + 24} ${102 + j * 38}h${38 - j * 8}`} />
                  </g>
                ))}
              </g>
            ))}
            <path
              className="service-route"
              d="M173 130h47m-7-6 7 6-7 6m126-6h40m-7-6 7 6-7 6"
              pathLength="1"
              data-service-line
            />
          </>
        )}
        {kind === "workflow" && (
          <>
            <path
              className="service-wire"
              d="M280 56v37m0 62v26q0 10-10 10H156q-12 0-12 12v13m136-61v26q0 10 10 10h114q12 0 12 12v13"
              pathLength="1"
              data-service-line
            />
            <g data-service-node>
              <rect className="service-pane" x="216" y="16" width="128" height="40" rx="3" />
              <path className="service-route" d="m267 27-8 10h11l-4 10 16-14h-12l5-6" />
              <path className="service-wire" d="M292 31h30m-30 10h19" />
            </g>
            <g data-service-node>
              <path
                className="service-ticket service-ticket--active"
                d="m280 88 42 42-42 42-42-42z"
              />
              <path className="service-route" d="m269 130 8 8 15-17" />
            </g>
            {[100, 372].map((x) => (
              <g key={x} data-service-node>
                <rect className="service-pane" x={x} y="212" width="88" height="36" rx="3" />
                <circle
                  className={x === 100 ? "service-signal" : "service-pin"}
                  cx={x + 18}
                  cy="230"
                  r="3"
                />
                <path className="service-wire" d={`M${x + 30} 230h38`} />
              </g>
            ))}
          </>
        )}
        {kind === "website" && (
          <>
            <g data-service-node>
              <rect className="service-pane" x="90" y="20" width="336" height="220" rx="4" />
              <path className="service-wire" d="M90 47h336" />
              {[105, 115, 125].map((x) => (
                <circle key={x} className="service-pin" cx={x} cy="34" r="2" />
              ))}
              <path
                className="service-wire"
                d="M116 73h44m132 0h28m12 0h28m12 0h28M116 102h144m-144 15h122m-122 26h112m-112 8h83"
              />
              <rect
                className="service-ticket service-ticket--active"
                x="116"
                y="169"
                width="82"
                height="24"
                rx="2"
              />
              <path className="service-route" d="M128 181h42m-5-4 5 4-5 4" />
              <rect className="service-ticket" x="290" y="96" width="109" height="97" rx="2" />
              <path className="service-wire" d="m301 180 29-35 22 21 20-42 17 56M116 214h283" />
            </g>
            <g data-service-node>
              <rect className="service-pane" x="374" y="111" width="84" height="138" rx="8" />
              <path
                className="service-wire"
                d="M403 121h26M386 144h55m-55 10h43m-43 19h55m-55 9h38"
              />
              <rect
                className="service-ticket service-ticket--active"
                x="386"
                y="201"
                width="55"
                height="20"
                rx="2"
              />
              <path className="service-route" d="M402 211h22" />
            </g>
          </>
        )}
        {kind === "integration" && (
          <>
            <ellipse className="service-orbit" cx="280" cy="130" rx="205" ry="95" />
            <path
              className="service-wire"
              d="M111 62h85q16 0 16 16v36h38m199 84h-85q-16 0-16-16v-36h-38M111 198h85q16 0 16-16v-36h38m199-84h-85q-16 0-16 16v36h-38"
              pathLength="1"
              data-service-line
            />
            {[
              [75, 36],
              [413, 36],
              [75, 172],
              [413, 172],
            ].map(([x, y], i) => (
              <g key={i} data-service-node>
                <rect className="service-pane" x={x} y={y} width="72" height="52" rx="3" />
                <path className="service-wire" d={`M${x + 19} ${y + 20}h34m-34 12h22`} />
              </g>
            ))}
            <g data-service-node>
              <rect
                className="service-ticket service-ticket--active"
                x="240"
                y="90"
                width="80"
                height="80"
                rx="4"
              />
              <path
                className="service-route"
                d="m264 115-11 15 11 15m32-30 11 15-11 15m-11-31-10 32"
              />
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
