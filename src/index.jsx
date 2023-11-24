import { render } from "solid-js/web";
import "./index.scss";
import data from "../extensions.json";

render(
    () => (
        <div id="extension-list">
            <For each={data.extensions}>
                {(ext) => (
                    <div class="extension">
                        <a target="_blank" href={ext.repo}>
                            <img src={ext.icon} alt={ext.id} />
                        </a>
                        <h2>{ext.id}</h2>
                        <span class="min-version">{ext.min_lnbits_version || "0.0.0"}</span>
                        <span class="version">{ext.version}</span>
                        <p>{ext.short_description}</p>
                        <a class="btn" target="_blank" href={ext.repo}>
                            github
                        </a>
                        <a class="btn" target="_blank" href={ext.archive}>
                            download
                        </a>
                    </div>
                )}
            </For>
        </div>
    ),
    document.getElementById("root")
);
