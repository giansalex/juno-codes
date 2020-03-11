import "./CodePage.css";

import { CodeDetails, Contract } from "@cosmwasm/sdk";
import React from "react";
import { Link, useParams } from "react-router-dom";

import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import { ClientContext } from "../../contexts/ClientContext";
import { CodeInfo } from "./CodeInfo";
import InstanceRow from "./InstanceRow";

export function CodePage(): JSX.Element {
  const clientContext = React.useContext(ClientContext);
  const { codeId: codeIdParam } = useParams();
  const codeId = parseInt(codeIdParam || "0", 10);

  const [details, setDetails] = React.useState<CodeDetails | undefined>();
  const [contracts, setContracts] = React.useState<readonly Contract[]>([]);

  React.useEffect(() => {
    clientContext.client.getContracts(codeId).then(setContracts);
    clientContext.client.getCodeDetails(codeId).then(setDetails);
  }, [clientContext.client, codeId]);

  const pageTitle = <span>Code #{codeId}</span>;

  return (
    <div className="page">
      <Header />
      <div className="container mt-3">
        <div className="row white-row white-row-first">
          <div className="col">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/codes">Codes</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {pageTitle}
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row white-row">
          <div className="col">
            <h1>{pageTitle}</h1>
            <ul className="list-group list-group-horizontal mb-3">
              <li className="list-group-item">Type: Wasm</li>
              <li className="list-group-item">
                Size: {details ? Math.round(details.data.length / 1024) + " KiB" : "Loading …"}
              </li>
            </ul>
          </div>
          <div className="col">{details ? <CodeInfo code={details} /> : <span>Loading …</span>}</div>
        </div>
        <div className="row white-row white-row-last">
          <div className="col">
            <h2>Instances</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Label</th>
                  <th scope="col">Contract</th>
                  <th scope="col">Creator</th>
                  <th scope="col">Executions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract, index) => (
                  <InstanceRow position={index + 1} contract={contract} key={contract.address} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <FooterRow />
      </div>
    </div>
  );
}