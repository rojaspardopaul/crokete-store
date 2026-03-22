import Switch from "react-switch";

const SwitchToggle = ({ id, title, handleProcess, processOption }) => {
  return (
    <>
      <div className={`${"mb-2"}`}>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600">
            {title}
          </label>

          <Switch
            id={id || title || ""}
            onChange={handleProcess}
            checked={processOption}
            className="react-switch md:ml-0 ml-3"
            uncheckedIcon={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: 12,
                  color: "white",
                  paddingRight: 4,
                  paddingTop: 0,
                }}
              >
                No
              </div>
            }
            width={56}
            height={22}
            handleDiameter={18}
            offColor="#E53E3E"
            onColor="#2F855A"
            checkedIcon={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: 12,
                  color: "white",
                  paddingLeft: 6,
                  paddingTop: 0,
                }}
              >
                Si
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default SwitchToggle;
