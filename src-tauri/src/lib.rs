use enigo::{
    Axis::Vertical, Coordinate::Rel, Direction::Click, Direction::Press, Direction::Release, Enigo,
    Key, Keyboard, Mouse, Settings,
};

#[tauri::command]
fn trigger_key(key: &str) {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    println!("Key: {key}");
    #[cfg(target_os = "macos")]
    {
        let char = key.chars().next().unwrap();
        let check_is_uppercase = char.is_ascii_uppercase();
        let unicode = Key::Unicode(key.to_lowercase().chars().next().unwrap());
        let special_chars = "{}|:\"<>?!@#$%^&*()_+";
        let check_is_special_char = special_chars.contains(char);
        if char == '/' {
            enigo.key(Key::Unicode('?'), Click).unwrap();
            return;
        }
        if check_is_uppercase || check_is_special_char {
            enigo.key(Key::Shift, Press).unwrap();
            enigo.key(unicode, Click).unwrap();
            enigo.key(Key::Shift, Release).unwrap();
        } else {
            enigo.key(unicode, Click).unwrap();
        }
    }
    #[cfg(target_os = "windows")]
    {
        enigo.text(key).unwrap();
    }
}
#[tauri::command]
fn trigger_enter() {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    println!("Enter");
    #[cfg(target_os = "macos")]
    enigo.key(Key::Return, Click).unwrap();
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
        .invoke_handler(tauri::generate_handler![
            trigger_key,
            scroll,
            move_mouse,
            trigger_enter
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
