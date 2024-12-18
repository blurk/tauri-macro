use enigo::{
    Axis::Vertical,
    Coordinate::Rel,
    Direction::{Click, Press, Release},
    Enigo, Key, Keyboard, Mouse, Settings,
};

#[tauri::command]
fn trigger_key(key: &str) {
    let value = key.chars().next().unwrap();
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    let check_is_uppercase = value.is_ascii_uppercase();
    let unicode = Key::Unicode(key.to_lowercase().chars().next().unwrap());
    let special_chars = "{}|:\"<>?!@#$%^&*()_+";
    let check_is_special_char = special_chars.contains(value);

    println!("Key: {key}, Value: {value}, check_is_uppercase: {check_is_uppercase}, check_is_special_char: {check_is_special_char}");

    if check_is_uppercase {
        enigo.key(Key::Shift, Press).unwrap();
        enigo.key(unicode, Click).unwrap();
        enigo.key(Key::Shift, Release).unwrap();
    } else if check_is_special_char {
        let _key = match value {
            '!' => Key::Unicode('1'),
            '@' => Key::Unicode('2'),
            '#' => Key::Unicode('3'),
            '$' => Key::Unicode('4'),
            '%' => Key::Unicode('5'),
            '^' => Key::Unicode('6'),
            '&' => Key::Unicode('7'),
            '*' => Key::Unicode('8'),
            '(' => Key::Unicode('9'),
            ')' => Key::Unicode('0'),
            '_' => Key::Other(189),
            '+' => Key::Other(187),
            '{' => Key::Other(219),
            '}' => Key::Other(221),
            '|' => Key::Other(226),
            ':' => Key::Other(186),
            '"' => Key::Other(222),
            '<' => Key::Other(188),
            '>' => Key::Other(190),
            '?' => Key::Other(220),
            _ => Key::Space,
        };

        enigo.key(Key::Shift, Press).unwrap();
        enigo.key(_key, Click).unwrap();
        enigo.key(Key::Shift, Release).unwrap();
    } else {
        enigo.key(unicode, Click).unwrap();
    }
}

#[tauri::command]
fn move_mouse(x: i32, y: i32) {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    enigo.move_mouse(x, y, Rel).unwrap();
}

#[tauri::command]
fn scroll() {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    enigo.scroll(1, Vertical).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            {
                let _ = app.handle().plugin(tauri_plugin_positioner::init());
                tauri::tray::TrayIconBuilder::new()
                    .on_tray_icon_event(|tray_handle, event| {
                        tauri_plugin_positioner::on_tray_event(tray_handle.app_handle(), &event);
                    })
                    .build(app)?;
            }
            Ok(())
        })
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![trigger_key, scroll, move_mouse])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
