import { render } from "solid-js/web";
import "./index.scss";
import data from "../extensions.json";

render(
    () => (
        <div id="extension-list">
            <For each={data.extensions}>
                {(ext) => (
                    <div class="extension">
                        <img src={ext.icon} alt={ext.id} />
                        <h2>{ext.id}</h2>
                        <span class="version">{ext.version}</span>
                        <p>{ext.short_description}</p>
                        <a target="_blank" href={ext.repo}>
                            github
                        </a>
                        <br />
                        <a target="_blank" href={ext.archine}>
                            download
                        </a>
                    </div>
                )}
            </For>
        </div>
    ),
    document.getElementById("root")
);
