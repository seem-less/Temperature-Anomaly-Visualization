#pragma once

#include "ofMain.h"
#include "ofxCv.h"
#include "ofxGui.h"

class ofApp : public ofBaseApp{
#include "tempVal.h"

	public:
		void setup();
		void update();
		void draw();

		void mousePressed(int x, int y, int button);
		
		//Arduino Connectivity here (Incomplete)
		/*ofSerial serial;
		ofBuffer mouseinfo;
		int input;
		ofBuffer inputval;*/

		//Visualization here
		int circleOd = 450;
		int circleMd = 350;
		int circleId = 300;	
		int spectrum;
		string changeLabel;
		string changeValue;
		float mag;
		float magPrev;
		int spectrumPrev;
		ofTrueTypeFont orbitron1, orbitron2;
		int inputInteraction;

		//Object detection here
		ofVideoGrabber cam;
		ofImage	thresh;
		ofxCv::ContourFinder contourzz;
		ofxCv::RunningBackground background;
		float minArea, maxArea;
		bool bLearnBackground;
		ofxPanel gui;
		ofParameter<bool> resetBackground;
		ofParameter<float> learningTime, thresholdValue;
		ofParameter<int> iterations, radius;
		ofImage bw;
		ofImage previous;
		ofImage diff;
		ofPoint center;

		int detectLowX;
		int detectHighX;
};
