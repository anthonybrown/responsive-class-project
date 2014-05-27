Ext.setup({
	tabletStartScreen: 'tablet_startup.png',
	phoneStartScreen: 'phone_startup.png',
	icon: 'icon.png',
	glossOnIcon: false,
	onReady: function() {
		//Timeline
		var timeline = new Ext.Component({
			title	: 'Timeline', // Name that appears on this tab
			cls		: 'timeline', // The CSS class. Lets you style elements on the timeline.
			scroll  : 'verticle', // Make it vertically scrollable
			tpl		: [
				'<tpl for=".">',
				  '<div class="tweet">',
				 	'<div class="avatar"><img src="{profile_image_url}" /></div>', // Tweeter's picture
					'<div class="tweet-content">',
					  '<h2>{from_user}</h2>' ,									  // Tweeter's name
					  '<p>{text}</p>',											  // Tweeter's message
					'</div>',
				  '</div>',
				'</tpl>'
			]
		});
		
		var map = new Ext.Map({
			title: 'Map',
			getLocation: true,
			mapOptions: {
				zoom: 12
			}
		});
		
		var panel = new Ext.TabPanel({
			fullscreen: true, 				// The pane will take up the full rather than the partial screen
			cardSwitchAnimation: 'slide',	// Special effect for switching between cards
			items: [map, timeline]			// Components (cards) that the tabs correspond with
		});
		
		var refresh = function() {	
																// Define the refresh function
			var coords = map.geo.coords;						// Define coords variable from the maps geolocation
			Ext.util.JSONP.request({							// Make an external call using JSON
				url: 'http://search.twitter.com/search.json',	// to this url
				callbackKey: 'callback',						// Set the required Twitter callback parameter
				params: {
					geocode: coords.latitude + ',' + coords.longitude + ',' + '5mi', // Get long, lat, and radius
					rpp: 30										// Number of tweets per page
				},
				callback: function(data) {						// Provide structure to hold data from Twitter callback
					data = data.results;						// Hold Twitter info in variable called data
					timeline.update(data)[i];					// Update tweets on timeline
										 
					for ( var i = 0, ln = data.length; i<ln; i++) {		// Loop to add points to the map
						var tweet = data[i];					// Get data for a single tweet
						
						if ( tweet.geo && tweet.geo.coordinates) {		// If the tweet is geo-tagged, use that to display marker
							var position = new google.maps.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]);  // Get coords
							addMarker(tweet, position);			// Call addMarker function with the new data
						}
					}
				}
			});
		};
		
		// These are all Google Maps APIs
		var addMarker = function(tweet, position) {		// Define addMarker function
			var marker = new google.maps.Marker({		// Define a variable to hold the marker data
				map: map.map,
				position: position
			});
		};
		
		map.geo.on('update', refresh);
		
		var tabBar = panel.getTabBar();		// Add a button to the Tab Bar
		tabBar.addDocked({
			xtype	: 'button',				// Specifies an instance of the button class
			ui	 	: 'mask',				// Apperance, for example, 'light' , 'dark', etc..
			iconCls	: 'refresh',				// CSS class for the button
			dock 	: 'right',				// Puts the new button at the right of the tab bar
			stretch : false,				// Prevents the button from stretching to full height of the tab bar
			align	: 'center',				// Centers the button vertically with the tab bar
			handler : refresh				// Refreshes the current card when user taps
		});
