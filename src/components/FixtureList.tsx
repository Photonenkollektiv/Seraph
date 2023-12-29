import { Box } from "@mui/material";
import { BaseFixture } from "../engine/fixtures/BaseFixture"
import { FixtureCard } from "./FixtureList/FixtureCard";

export type FixtureListProps = {
    fixtures: BaseFixture[]
    reRenderHook: () => void,
    dmxGroupsUnique: string[],
    copyFixture: (fixture: BaseFixture) => void,
    deleteFixture: (fixture: BaseFixture) => void
    createFixture: (fixture: BaseFixture) => void
}

export const FixtureList = (props: FixtureListProps) => {
    const { fixtures, reRenderHook, dmxGroupsUnique, copyFixture, deleteFixture,createFixture } = props;
    return (
        <Box sx={{ paddingLeft: 2, marginRight: 2, paddingTop: 2 }}>
            {fixtures.map((fixture) => (
                <FixtureCard createFixture={createFixture} copyFixture={copyFixture} deleteFixture={deleteFixture} dmxGroupsUnique={dmxGroupsUnique} key={fixture.instanceName} reRenderHook={reRenderHook} fixture={fixture} />
            ))}
        </Box>
    )
}